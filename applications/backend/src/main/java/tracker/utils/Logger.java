package tracker.utils;

public class Logger {
  private static final String RESET = "\u001B[0m";
  private static final String PURPLE = "\u001B[35m";
  private static final String RED = "\u001B[31m";
  private static final String GREEN = "\u001B[32m";
  private static final String YELLOW = "\u001B[33m";
  private static final String BLUE = "\u001B[34m";

  /**
   * Print a message in purple.
   *
   * @param message The message to print.
   */
  public static void printPurple(Object message) {
    System.out.println(PURPLE + message + RESET);
  }

  /**
   * Print a message in red.
   *
   * @param message The message to print.
   */
  public static void printRed(Object message) {
    System.out.println(RED + message + RESET);
  }

  /**
   * Print a message in green.
   *
   * @param message The message to print.
   */
  public static void printGreen(Object message) {
    System.out.println(GREEN + message + RESET);
  }

  /**
   * Print a message in yellow.
   *
   * @param message The message to print.
   */
  public static void printYellow(Object message) {
    System.out.println(YELLOW + message + RESET);
  }

  /**
   * Print a message in blue.
   *
   * @param message The message to print.
   */
  public static void printBlue(Object message) {
    System.out.println(BLUE + message + RESET);
  }

  /**
   * Print a message with no color (default).
   *
   * @param message The message to print.
   */
  public static void print(Object message) {
    System.out.println(message);
  }
}
