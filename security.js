exports.setCors=(req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*")

    res.header(
        "Access-Control-Allow-Headers",
        "Origin, x-Request-With, Content-Type, Accept, multipart/form-data, form-data"
    )

    res.header("Access-Control-Allow-Methods","POST, GET, PUT, DELETE, OPTIONS")
    next()
}