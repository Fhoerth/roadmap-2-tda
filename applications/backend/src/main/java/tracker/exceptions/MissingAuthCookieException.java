package tracker.exceptions;

public class MissingAuthCookieException extends RuntimeException {
  public MissingAuthCookieException(String message) {
    super(message);
  }
}
