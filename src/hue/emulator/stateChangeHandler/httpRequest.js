
const StateChangeHandler = {

    stateChanged(device, state, value) {

        console.log(`Example state changed: ${state}, value: ${value}`);

    }

}

module.exports = StateChangeHandler;