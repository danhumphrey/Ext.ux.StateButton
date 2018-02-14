Ext.namespace('Ext.ux');
/**
 * <p>StateButton is a Button which has various 'states'. When the Button is clicked, it cycles to the next state.</p>
 *
 * @author <a href="https://github.com/danhumphrey">Dan Humphrey</a>
 * @class Ext.ux.StateButton
 * @extends Button
 * @component
 * @plugin
 * @version 1.1
 *
 */
Ext.ux.StateButton = Ext.extend(Ext.Button, {
    /**
     * @cfg {Boolean} callHandlerOnLeavingState When true, any state handlers will be called when leaving the state. When false the state handlers will be called when entering a state. Defaults to true.
     */
    callHandlerOnLeavingState : true,
    /**
     * @cfg {Array} states An array of state objects for the button. Each state object can be configured with the following config properties:
     * <ul>
     *     <li>itemId {String} - A name or unique identifier for the state</li>
     *     <li>text {String} - The text to apply to the Button when this state is active</li>
     *     <li>iconCls {String} - The iconCls to apply to the Button when this state is active</li>
     *     <li>tooltip {String|Object} [optional] - The tooltip to apply to the Button when this state is active</li>
     *     <li>handler {Function} [optional] - The handler to function to execute when this state is activated</li>
     * </ul>
     */
    states : [],
    constructor: function(config){
        Ext.ux.StateButton.superclass.constructor.call(this,config);
        this.addEvents(
            /**
             * Fires before the field is expanded. Return false to prevent the field expanding.
             * @event statechange
             * @memberOf Ext.ux.StateButton
             * @param {StateButton} this
             * @param {String} oldState The state itemId before changing state
             * @param {String} newState The state itemId of the new state
             */
            'statechange'
        );
    },
    initComponent : function(){
        this.currentState = null;
        this.currentStateIndex = null;
        this.stateCount = this.states.length;
        Ext.each(this.states, function(s, i){
           if(s.selected){
               this.currentState = s;
               this.currentStateIndex = i;
               return false;
           }
        }, this);
        if(!this.currentState){
            this.currentState = this.states[0];
            this.currentStateIndex = 0;
        }
        Ext.apply(this,{
            overflowText : this.currentState.overflowText || this.currentState.text || this.overflowText || this.text,
            text : this.currentState.text,
            iconCls : this.currentState.iconCls,
            tooltip : this.currentState.tooltip
        });
        Ext.ux.StateButton.superclass.initComponent.call(this);
        
        this.setHandler(this.onClick, this);
        
    },
    onClick : function(){ 
        //Ext.ux.StateButton.superclass.onClick.call(this);
        this.nextState()
    },
    callStateHandler : function(){
        if(this.currentState.handler && Ext.isFunction(this.currentState.handler)){
            var scope = this.currentState.scope || this;
            this.currentState.handler.call(scope, this, this.currentState.itemId);
        }
    },
    nextState : function(){
        var next;
        if(this.currentState !== null){
            if(this.currentStateIndex === (this.states.length - 1)){
                next = 0;
            } else {
                next = this.currentStateIndex + 1;
            }
             
            this.setState(next);
        }
    },
    /**
     * Sets the state of the component.
     * @methodOf Ext.ux.StateButton
     * @name setState
     * @param {Number|String} id The numerical index (zero based) or the itemId of the state.
     * @return {Ext.ux.StateButton} this    
     */
    setState : function(id){
        var next = -1,
           s = this.currentState;
        if(Ext.isNumber(id)){
            if(id >=0 && id < this.stateCount){
                next = id;  
            }
        }else{
            Ext.each(this.states, function(s, i){
                if(id === s.itemId){
                    next = i;
                    return false;
                }
            },this);
        }
        if(next !== this.currentStateIndex && next > -1) {
            if(this.callHandlerOnLeavingState){
                this.callStateHandler();    
            }
            this.currentState = this.states[next];
            this.currentStateIndex = next;
            this.applyState();
            this.fireEvent('statechange',s.itemId, this.currentState.itemId)
        }
        return this;
    },
    setOverflowText : function(t){
        this.overflowText = t;
    },
    /**
     * Gets the current state of the component.
     * @methodOf Ext.ux.StateButton
     * @name getState
     * @param {Boolean} asIndex [optional] Set to true to return the index of the state.
     * @return {String|Number} The itemId of the current state, or the index of the current state (if asIndex param is true).   
     */
    getState : function(asIndex){
        return asIndex ? this.currentStateIndex : this.currentState.itemId;
    },
    applyState : function(){
        Ext.QuickTips.disable();
        Ext.QuickTips.unregister(this.btnEl);
        var s = this.currentState;
        if(this.setOverflowText){
            this.setOverflowText(s.overflowText || s.text || this.overflowText || this.text);
        }
        this.setText(s.text || this.text);
        this.setIconClass(s.iconCls || this.iconCls);
        this.setTooltip(s.tooltip || '');
        if(!this.callHandlerOnLeavingState){
            this.callStateHandler();    
        }
        Ext.QuickTips.enable();
    }
});
Ext.reg('statebutton', Ext.ux.StateButton);  