package tracker.exceptions;

public class LeetCodeServiceForwardedException extends RuntimeException {
  public Integer status;
  public String message;

  public LeetCodeServiceForwardedException(Integer status, String message) {
    super(message);
    this.status = status;
    this.message = message;
  }
}
