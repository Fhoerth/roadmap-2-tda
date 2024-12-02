package tracker.utils;

public class HexToBytes {
  public static byte[] convert(String hex) {
    int length = hex.length();
    byte[] bytes = new byte[length / 2];

    for (int i = 0; i < length; i += 2)
      bytes[i / 2] = (byte) ((Character.digit(hex.charAt(i), 16) << 4) + Character.digit(hex.charAt(i + 1), 16));

    return bytes;
  }
}
