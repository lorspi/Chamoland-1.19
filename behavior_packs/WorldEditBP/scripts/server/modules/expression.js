import { contentLog } from './../../library/Minecraft.js';
import { Token } from './extern/tokenizr.js';
import { tokenize, throwTokenError, mergeTokens, processOps } from './parser.js';
/*
10: x++ x-- x!
9: --x ++x ~x -x !x
8: ^
7: * / %
6: + -
5: << >>
4: < <= > >=
3: == != ~=
2: && ||
1: = += -= *= /= %= ^=
*/
export class Expression {
    constructor(expr = '') {
        this.stringObj = '';
        if (expr) {
            const obj = Expression.parseArgs([expr]).result;
            this.stringObj = obj.stringObj;
        }
    }
    compile() {
        contentLog.debug(this.root.compile());
        return new Function('x', 'y', 'z', 'return ' + this.root.compile());
    }
    static parseArgs(args, index = 0) {
        const input = args[index];
        if (!input) {
            return { result: new Expression(), argIndex: index + 1 };
        }
        const tokens = tokenize(input);
        let token;
        function processTokens(scope = null) {
            let ops = [];
            let out = [];
            const start = tokens.curr();
            function nodeToken() {
                return mergeTokens(token, tokens.curr(), input);
            }
            while (token = tokens.next()) {
                if (token.type == 'space') {
                    continue;
                }
                else if (token.type == 'number') {
                    out.push(new NumberExpression(token));
                }
                else if (token.type == 'id') {
                    if (tokens.peek().value === '(') {
                        tokens.next();
                        let args = [];
                        const t = token;
                        while (tokens.curr().value === '(' || tokens.curr().value === ',') {
                            args.push(processTokens('functionArg'));
                        }
                        token = t;
                        let func = new FunctionExpression(nodeToken(), token.value);
                        func.nodes = args;
                        out.push(func);
                    }
                    else {
                        out.push(new VariableExpression(token));
                    }
                }
                else if (['+', '-', '*', '/', '^', '%', '=', '!', '~', '>', '<'].includes(token.value) && tokens.peek().value === '=') {
                    // Assignment and equality operators
                    tokens.next();
                    processOps(out, ops, new BinaryOperator(nodeToken()));
                }
                else if (['>', '<', '&', '|'].includes(token.value)) {
                    // Bit shift and logical operators
                    if (tokens.peek().value === token.value) {
                        tokens.next();
                        processOps(out, ops, new BinaryOperator(nodeToken()));
                    }
                    else if (token.value === '>' || token.value === '<') {
                        processOps(out, ops, new BinaryOperator(token));
                    }
                    else {
                        throwTokenError(token);
                    }
                }
                else if (['+', '-', '*', '/', '^', '%'].includes(token.value)) {
                    // Arithmetic operators
                    processOps(out, ops, new BinaryOperator(token));
                }
                else if (token.value === '(') {
                    out.push(processTokens('bracket'));
                }
                else if (token.value === ')') {
                    if (scope != 'bracket' && scope != 'functionArg') {
                        throwTokenError(token);
                    }
                    else {
                        processOps(out, ops);
                        break;
                    }
                }
                else if (token.value === ',') {
                    if (scope != 'functionArg') {
                        throwTokenError(token);
                    }
                    else {
                        processOps(out, ops);
                        break;
                    }
                }
                else if (token.type == 'EOF') {
                    if (scope) {
                        throwTokenError(token);
                    }
                    else {
                        processOps(out, ops);
                    }
                }
                else {
                    throwTokenError(token);
                }
            }
            if (out.length > 1) {
                throwTokenError(out.slice(-1)[0].token);
            }
            else if (!out.length) {
                throwTokenError(start);
            }
            else if (ops.length) {
                const op = ops.slice(-1)[0];
                throwTokenError(op instanceof Token ? op : op.token);
            }
            return out[0];
        }
        let out;
        try {
            out = processTokens();
            out.postProcess();
        }
        catch (error) {
            if (error.pos != undefined) {
                const err = {
                    isSyntaxError: true,
                    idx: index,
                    start: error.pos,
                    end: error.pos + 1,
                    stack: error.stack
                };
                throw err;
            }
            throw error;
        }
        const expression = new Expression();
        expression.stringObj = args[index];
        expression.root = out;
        return { result: expression, argIndex: index + 1 };
    }
    static clone(original) {
        const expression = new Expression();
        expression.root = original.root;
        expression.stringObj = original.stringObj;
        return expression;
    }
    toString() {
        return `[expression: ${this.stringObj}]`;
    }
}
class ExpressionNode {
    constructor(token) {
        this.token = token;
        this.nodes = [];
    }
    postProcess() { }
}
class NumberExpression extends ExpressionNode {
    constructor(token) {
        super(token);
        this.prec = -1;
        this.opCount = 0;
        this.value = token.value;
    }
    compile() {
        return this.value.toString();
    }
}
class VariableExpression extends ExpressionNode {
    constructor(token) {
        super(token);
        this.prec = -1;
        this.opCount = 0;
        this.id = token.value;
    }
    compile() {
        return this.id;
    }
    postProcess() {
        if (this.id.toLowerCase() == 'pi') {
            this.id = Math.PI.toString();
        }
        else if (this.id.toLowerCase() == 'e') {
            this.id = Math.E.toString();
        }
    }
}
class FunctionExpression extends ExpressionNode {
    constructor(token, name) {
        super(token);
        this.prec = -1;
        this.opCount = 0;
        this.id = name;
    }
    compile() {
        let js = this.id + '(';
        let addComma = false;
        for (const node of this.nodes) {
            js += (addComma ? ',' : '') + node.compile();
            addComma = true;
        }
        return js + ')';
    }
    postProcess() {
        // TODO: Implement log10, rint, and other non Math functions
        if (this.id == 'ln') {
            this.id = 'log';
        }
        if (['abs', 'acos', 'asin', 'atan2', 'atan', 'cbrt', 'ceil', 'cos', 'cosh', 'exp', 'floor', 'log', 'max', 'min', 'round', 'sin', 'sinh', 'sqrt', 'tan', 'tanh'].includes(this.id)) {
            this.id = 'Math.' + this.id;
        }
        for (const node of this.nodes) {
            node.postProcess();
        }
    }
}
class BinaryOperator extends ExpressionNode {
    constructor(token) {
        super(token);
        this.opCount = 2;
        this.ops = {
            '=': 1, '+=': 1, '-=': 1, '*=': 1, '/=': 1, '%=': 1, '^=': 1,
            '&&': 2, '||': 2,
            '==': 3, '!=': 3, '~=': 3,
            '<': 4, '<=': 4, '>': 4, '>=': 4,
            '<<': 5, '>>': 5,
            '+': 6, '-': 6,
            '*': 7, '/': 7, '%': 7,
            '^': 8,
        };
        this.opType = token.value;
        this.prec = this.ops[token.value];
        this.rightAssoc = ['=', '+=', '-=', '*=', '/=', '%=', '^=', '^'].includes(token.value);
    }
    postProcess() {
        for (const node of this.nodes) {
            node.postProcess();
        }
    }
    compile() {
        if (this.opType.startsWith('^')) {
            let expr = `Math.pow(${this.nodes[0].compile()},${this.nodes[1].compile()})`;
            if (this.opType.endsWith('=')) {
                return this.nodes[0].compile() + '=' + expr;
            }
            return expr;
        }
        else {
            return `(${this.nodes[0].compile()}${this.opType}${this.nodes[1].compile()})`;
        }
    }
}
