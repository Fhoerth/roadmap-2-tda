package tracker.controllers;

import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import tracker.exceptions.BadRequestException;
import tracker.exceptions.UnauthorizedException;

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
