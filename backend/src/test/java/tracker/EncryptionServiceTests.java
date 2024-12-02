package tracker;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Base64;
import org.junit.jupiter.api.Test;
import tracker.services.EncryptionService;

public class EncryptionServiceTests {
  private static final String BASE_64_MASTER_KEY = "Uw7JanJPixacxBMvuhrJhLVjqxoWIh7HRgq2+FwQn0c=";

  @Test
  void encrypt_decrypt_test() {
    boolean failed = false;

    EncryptionService service = new EncryptionService();
    byte[] masterKey = Base64.getDecoder().decode(BASE_64_MASTER_KEY);

    try {
      String base64SecretKey = service.createBase64SecretKey(masterKey);
      byte[] secretKey = service.decryptBase64SecretKey(base64SecretKey, masterKey);

      String textToBeEncrypted = "HELLO_WORLD";
      String encryptedText = service.base64Encrypt(textToBeEncrypted, secretKey);
      String decryptedText = service.base64Decrypt(encryptedText, secretKey);

      assertEquals(textToBeEncrypted, decryptedText);
    } catch (Exception e) {
      e.printStackTrace();
      failed = true;
    }

    assertFalse(failed);
  }
}
