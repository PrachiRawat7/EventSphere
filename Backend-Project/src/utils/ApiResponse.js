//api reponse and error respnse are always in the class formta
class ApiResponse{
    constructor(statusCode,data,message="Success"){
        this.data=data
        this.statusCode=statusCode
        this .message=message
        this.success=statusCode<400
    }

}
export {ApiResponse}