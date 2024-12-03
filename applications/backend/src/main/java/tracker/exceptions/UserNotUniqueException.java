package tracker.exceptions;

public class UserNotUniqueException extends RuntimeException {
  public UserNotUniqueException(String message) {
    super(message);
  }
}
