class ControleC {

    constructor() {

        this._lastOperator = '';
        this._lastNumber = '';

        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");

        this._currentDate;

        this.inicializa();
        this.eventosBotao();
        this.iniBotao();

    }

    copiaProTeclado() {

        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand("Copy");

        input.remove();

    }

    copiaDoTeclado() {

        document.addEventListener('paste', e => {

            let text = e.clipboardData.getData('Text');

            this.displayCalc = parseFloat(text);

        });

    }

    inicializa() {

        this.tempoNoDisplay();

        setInterval(() => {

            this.tempoNoDisplay();

        }, 1000);

        this.ultimoNumeroDisplay();
        this.copiaDoTeclado();

    }

    iniBotao() {

        document.addEventListener('keyup', e => {

            switch (e.key) {
                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperacao(e.key);
                    break;
                case 'Enter':
                case '=':
                    this.calc();
                    break;
                case '.':
                case ',':
                    this.addDot();
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperacao(parseInt(e.key));
                    break;

                case 'c':
                    if (e.ctrlKey) this.copiaProTeclado();
                    break;
                
            }

        });

    }

    addEventListenerAll(element, events, fn) {

        events.split(' ').forEach(event => {

            element.addEventListener(event, fn, false);

        });

    }

    clearAll() {

        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';

        this.ultimoNumeroDisplay();

    }

    clearEntry() {

        this._operation.pop();

        this.ultimoNumeroDisplay();

    }

    pegaUltimoOperador() {

        return this._operation[this._operation.length - 1];

    }

    setUltimaOperacao(value) {

        this._operation[this._operation.length - 1] = value;

    }

    eOperador(value) {

        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);

    }

    encaixaOperador(value) {

        this._operation.push(value);

        if (this._operation.length > 3) {

            this.calc();

        }

    }

    getresultado() {

        try {
            return eval(this._operation.join(""));
        } catch (e) {
            setTimeout(() => this.setError(), 1);
        }

    }

    calc() {

        let last = '';

        this._lastOperator = this.pegaUltimoItem();

        if (this._operation.length < 3) {

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];

        }

        if (this._operation.length > 3) {

            last = this._operation.pop();
            this._lastNumber = this.getresultado();

        } else if (this._operation.length === 3) {

            this._lastNumber = this.pegaUltimoItem(false);

        }

        let resultado = this.getresultado();

        if (last === '%') {

            resultado /= 100;
            this._operation = [resultado];

        } else {

            this._operation = [resultado];

            if (last) this._operation.push(last);

        }

        this.ultimoNumeroDisplay();

    }

    pegaUltimoItem(eOperador = true) {

        let lastItem;

        for (let i = this._operation.length - 1; i >= 0; i--) {

            if (this.eOperador(this._operation[i]) === eOperador) {
                lastItem = this._operation[i];
                break;
            }

        }

        if (!lastItem) {

            lastItem = (eOperador) ? this._lastOperator : this._lastNumber;

        }

        return lastItem;

    }

    ultimoNumeroDisplay() {

        let lastNumber = this.pegaUltimoItem(false);

        if (!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;

    }
    addOperacao(value) {

        if (isNaN(this.pegaUltimoOperador())) {

            if (this.eOperador(value)) {

                this.setUltimaOperacao(value);

            } else {

                this.encaixaOperador(value);

                this.ultimoNumeroDisplay();


            }

        } else {

            if (this.eOperador(value)) {

                this.encaixaOperador(value);

            } else {

                let newValue = this.pegaUltimoOperador().toString() + value.toString();
                this.setUltimaOperacao(newValue);

                this.ultimoNumeroDisplay();

            }

        }

    }

    setError() {

        this.displayCalc = "Error";

    }

    addDot() {

        let lastOperation = this.pegaUltimoOperador();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if (this.eOperador(lastOperation) || !lastOperation) {
            this.setUltimaOperacao('0.');
        } else {
            this.setUltimaOperacao(lastOperation.toString() + '.');
        }

        this.ultimoNumeroDisplay();

    }

    execbotao(value) {

        switch (value) {
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperacao('+');
                break;
            case 'subtracao':
                this.addOperacao('-');
                break;
            case 'divisao':
                this.addOperacao('/');
                break;
            case 'multiplicacao':
                this.addOperacao('*');
                break;
            case 'porcento':
                this.addOperacao('%');
                break;
            case 'igual':
                this.calc();
                break;
            case 'ponto':
                this.addDot();
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperacao(parseInt(value));
                break;
            default:
                this.setError();
            
        }

    }

    eventosBotao() {

        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        buttons.forEach((btn, index) => {

            this.addEventListenerAll(btn, 'click drag', e => {

                let textBtn = btn.className.baseVal.replace("btn-", "");

                this.execbotao(textBtn);

            });

            this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e => {

                btn.style.cursor = "pointer";

            });

        });

    }

    tempoNoDisplay() {

        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);

    }

    get displayTime() {
        return this._timeEl.innerHTML;
    }

    set displayTime(value) {
        this._timeEl.innerHTML = value;
    }

    get displayDate() {
        return this._dateEl.innerHTML;
    }

    set displayDate(value) {
        this._dateEl.innerHTML = value;
    }

    get displayCalc() {

        return this._displayCalcEl.innerHTML;

    }

    set displayCalc(value) {

        if (value.toString().length > 10) {
            this.setError();
            return false;
        }

        this._displayCalcEl.innerHTML = value;
        
    }

    get currentDate() {
        return new Date();
    }

    set currentDate(value) {
        this._currentDate = value;
    }

}