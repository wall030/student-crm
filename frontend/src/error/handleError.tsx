import toast from "react-hot-toast";
import {FormattedMessage} from "react-intl";
import React from "react";


export function handleError( code: string = "5000") {

    return toast.error(<FormattedMessage id={code} />)
}
