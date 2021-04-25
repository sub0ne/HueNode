
const StateChangeHandler = {

    stateChanged(device, state, value, parameters) {
        
        console.log(`Example state changed: ${state}, value: ${value}`);

    }

}

module.exports = StateChangeHandler;