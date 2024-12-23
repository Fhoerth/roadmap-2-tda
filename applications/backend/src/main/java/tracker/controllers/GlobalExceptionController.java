package tracker.controllers;

import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import tracker.exceptions.BadRequestException;
import tracker.exceptions.LeetCodeServiceForwardedException;
import tracker.exceptions.LeetCodeServiceRequestException;
import tracker.exceptions.LeetCodeServiceResponseException;
import tracker.exceptions.UnauthorizedException;
import tracker.exceptions.UserNotFoundException;
import tracker.exceptions.UserNotUniqueException;

@ControllerAdvice
public class GlobalExceptionController {
  @ExceptionHandler(BadRequestException.class)
  public ResponseEntity<ErrorResponse> handleBadRequestException(BadRequestException exception) {
    ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.toString(), exception.getMessage());
    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(UnauthorizedException.class)
  public ResponseEntity<ErrorResponse> handleUnauthorizedException(UnauthorizedException exception) {
    ErrorResponse errorResponse = new ErrorResponse(HttpStatus.UNAUTHORIZED.toString(), exception.getMessage());
    return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
  }

  @ExceptionHandler(UserNotUniqueException.class)
  public ResponseEntity<ErrorResponse> handleUserNotUniqueException(UserNotUniqueException exception) {
    ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.toString(), exception.getMessage());
    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(UserNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleUserNotFoundException(UserNotFoundException exception) {
    ErrorResponse errorResponse = new ErrorResponse(HttpStatus.NOT_FOUND.toString(), exception.getMessage());
    return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(LeetCodeServiceRequestException.class)
  public ResponseEntity<ErrorResponse> handleLeetCodeServiceRequestException(
      LeetCodeServiceRequestException exception) {
    ErrorResponse errorResponse = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.toString(),
        exception.getMessage());
    return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @ExceptionHandler(LeetCodeServiceResponseException.class)
  public ResponseEntity<ErrorResponse> handleLeetCodeServiceResponseException(
      LeetCodeServiceResponseException exception) {
    ErrorResponse errorResponse = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.toString(),
        exception.getMessage());
    return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @ExceptionHandler(LeetCodeServiceForwardedException.class)
  public ResponseEntity<ErrorResponse> handleLeetCodeServiceForwardedException(
      LeetCodeServiceForwardedException exception) {
    System.out.println("Exception handler invoked for: " + exception.getMessage());
    ErrorResponse errorResponse = new ErrorResponse(exception.status.toString(), exception.message);
    return new ResponseEntity<>(errorResponse, HttpStatus.valueOf(exception.status));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Object> handleException(Exception exception) {
    ErrorResponse errorResponse = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.toString(),
        "An unexpected error occurred. Please try again later.");
    return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @Data
  public static class ErrorResponse {
    private String errorCode;
    private String errorMessage;

    public ErrorResponse(String errorCode, String errorMessage) {
      this.errorCode = errorCode;
      this.errorMessage = errorMessage;
    }
  }
}
