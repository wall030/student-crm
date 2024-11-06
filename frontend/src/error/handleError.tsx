import toast from "react-hot-toast";
import {FormattedMessage} from "react-intl";
import React from "react";


export function handleError( code: String ) {
    console.error("Error: ", code)
    return toast.error(<FormattedMessage id={code} />)
}
