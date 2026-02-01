import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

/*

const healthCheck = (req, res) => {
  try {
    res
      .status(200)
      .json(new ApiResponse(200, { message: "service is up and running" }));
  } catch (error) {
    res.status(500).json(ApiResponse.error("Internal Server Error"));
  }
};
*/ 

const healthCheck = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, { message: "service is up and running" }));
})
export { healthCheck };
