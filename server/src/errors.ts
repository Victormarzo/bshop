import { ApplicationError } from "./protocols";

export function duplicatedNumberError(): ApplicationError {
  return {
    name: "DuplicatedNumberError",
    message: "There is already an user with given number",
  };
}
export function notFoundError(): ApplicationError {
  return {
    name: "NotFoundError",
    message: "No result for this search!",
  };
}