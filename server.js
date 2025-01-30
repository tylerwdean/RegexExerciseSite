const express = require("express")
const app = express()

app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}))

app.get("/", (req, res) =>{
    errors = {}
    answers = {}
    res.render("form", {errors})
})

app.post("/", (req, res) =>{

    let errors = {}
    let answers = {}
    let errCount = 0;
    let errString = ""

    answers['name'] = req.body.name.trim()
    answers['address'] = req.body.address.trim()
    answers['bday'] = req.body.bday.trim()
    answers['ssn'] = req.body.ssn.trim()
    answers['phone'] = req.body.phone.trim()
    answers['credit'] = req.body.credit.trim()

    //initialize the text into errors

    if(!answers['name'].match(/^[A-Z][a-z]+ [A-Z][a-z]+ (O\')?[A-Z][a-z]+$/)){
        errString = "Please include first, middle and last names."

        if(answers['name'].match(/^[A-Z][a-z]+ (O\')?[A-Z][a-z]+$/)) errString = "Please include a middle name"

        errors['name'] = errString
        errCount++
    }

    
    if(!answers['address'].match(/^[0-9]+ [A-Z][a-z]+( [A-Za-z]+.?)+$/)){
        errString = "Please include street number and street name."

        if(answers['address'].match(/^[0-9]+ [a-z]+( [A-Za-z]+.?)+/)) errString = "Please include a capital letter on the street name"

        errors['address'] = errString 
        errCount++
    }

    if(!answers['bday'].match(/^[0-1][0-9][\/\-][0-3][0-9][\/\-][0-9]{4}$/)){
        errString = "Please include month, day and year in format: MM-DD-YYYY or MM/DD/YYYY."
        
        if(answers['bday'].match(/^[0-1][0-9][\/\-][0-3][0-9][\/\-][0-9]{2}$/)) errString = "Please use a four-digit year"

        errors['bday'] = errString
        errCount++
    }
    
    if(!answers['ssn'].match(/^[0-9]{3}\-[0-9]{2}\-[0-9]{4}$/)) {
        errString = "Please follow format ###-##-####."
        
        if (answers['ssn'].match(/^[0-9]{9}$/)) errString = "Please use dashes in your number"

        errors['ssn'] = errString
        errCount++
    }

    if(!answers['phone'].match(/^\([0-9]{3}\)[\- ]?[0-9]{3}[\- ]?[0-9]{4}$/)){
        errString = "Please group the numbers correctly."

        if (answers['phone'].match(/[A-Za-z]+/)) errString = "Please don't use letters in phone number."
        else if (!answers['phone'].match(/^\([0-9]{3}\)/)) errString = "Please provide area code in parenthesis."
        else if (!answers['phone'].match(/([0-9][\(\) ]?){10}/)) errString = "Please provide 10 digits."

        errors['phone'] = errString
        errCount++
    }

    if(!answers['credit'].match(/^[2345][0-9]{7,18}$/)){
        errString = "Please enter between 8 and 19 numbers, numbers only"

        if (answers['credit'].match(/^[0-9]{8,19}$/)) errString = "Please enter a Visa Card, Master Card, or American Express Card"

        errors['credit'] = errString
        errCount++
    }
    else {

        //8532 should be valid
        //Luhn's verification
        let checksum = 0;
        let credit = answers['credit']

        for (let i = 0; i < credit.length-1; i++) {
            let digit = credit[i]*(((i+1)%2)+1) //multiplies by 2 if even, 1 if odd
            if (digit > 9) digit = 1+(digit%10) //if bigger than 10, sums the digits of the numbers
            checksum += digit
        }
        checksum = (10-(checksum%10))%10
        if(!(checksum==credit[credit.length-1])){
            errors['credit'] = "Please enter valid CC number"
            errCount++
        }
    }

    if(errCount > 0)
        return res.render("form", {errors, answers})

    return res.render("result")
})

app.listen(3000)