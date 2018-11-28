// Do use async functions here and await here
//
// Basic function layout 
//
exports.testfunc = async () => {
    // Do something that needs time
    // When the function is not a promise, turn it to promise like this
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve("done!"), 1000) // something that needs time to run 
    })
    let result = await promise

    // When the function is not a promise (e.g. foo() returns a promise), do the following
    // let result = await foo()
    console.log(result)
}

exports.nlpSwitch = async(err, event_context) => {
    if (err) {
        // TODO handle error messages
    } else {
        // TODO handle other messages
    }
}