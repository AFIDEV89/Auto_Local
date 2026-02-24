import * as constants from "../../constants/index.js";
import messages from './content.js';

function responseCtr({ res, statusCode = constants.GET_SUCCESS, data, message }) {
  if (data) {
    res.json({
      statusCode,
      message,
      data
    });
  } else {
    res.json({
      statusCode: 400,
      message: messages.bad_request,
    });
  }
}

export default responseCtr;
