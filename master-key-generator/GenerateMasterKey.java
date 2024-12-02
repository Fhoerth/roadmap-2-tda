import java.io.*;
import java.nio.file.*;
import java.util.Base64;
import java.security.SecureRandom;

public class GenerateMasterKey {
  private static final Integer LENGTH = 32;

  public static void main(String[] args) {
    String envFilePath = ".env"; // Ruta al archivo .env
    String keyVariableName = "BACKEND_MASTER_KEY";
    String key = generateRandomKey();

    try {
      File envFile = new File(envFilePath);

      if (!envFile.exists()) {
        envFile.createNewFile();
      }

      String content = new String(Files.readAllBytes(envFile.toPath()));
      String updatedContent;

      if (content.contains(keyVariableName + "=")) {
        updatedContent = content.replaceAll(keyVariableName + "=.*", keyVariableName + "=\"" + key + "\"");
      } else {
        updatedContent = content + System.lineSeparator() + keyVariableName + "=" + key;
      }

      Files.write(envFile.toPath(), updatedContent.getBytes());

      System.out.println("Clave generada y guardada en " + envFilePath);
      System.out.println(keyVariableName + "=" + key);
    } catch (IOException e) {
      System.err.println("Error al leer o escribir el archivo .env: " + e.getMessage());
    }
  }

  private static String generateRandomKey() {
    SecureRandom random = new SecureRandom();
    byte[] keyBytes = new byte[LENGTH];
    random.nextBytes(keyBytes);

    StringBuilder hexKey = new StringBuilder();
    for (byte b : keyBytes) {
      hexKey.append(String.format("%02x", b));
    }

    return hexKey.toString();
  }
}
