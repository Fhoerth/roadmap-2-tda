package tracker.services;

import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.stereotype.Service;

@Service
public class EncryptionService {
  private final String ALGORITHM = "AES";

  public String createBase64SecretKey(byte[] masterKey) throws Exception {
    KeyGenerator keyGen = KeyGenerator.getInstance(ALGORITHM);

    keyGen.init(256);

    SecretKey randomKey = keyGen.generateKey();
    String base64RandomKey = Base64.getEncoder().encodeToString(randomKey.getEncoded());
    String signedBase64Key = base64Encrypt(base64RandomKey, masterKey);

    return signedBase64Key;
  }

  public byte[] decryptBase64SecretKey(String base64SecretKey, byte[] masterKey) throws Exception {
    SecretKey key = new SecretKeySpec(masterKey, ALGORITHM);
    Cipher cipher = Cipher.getInstance(ALGORITHM);

    cipher.init(Cipher.DECRYPT_MODE, key);

    byte[] encryptedBytes = Base64.getDecoder().decode(base64SecretKey); // Decodifica Base64 a bytes
    byte[] decryptedBytes = cipher.doFinal(encryptedBytes); // Desencripta los bytes

    return Base64.getDecoder().decode(new String(decryptedBytes));
  }

  public String base64Encrypt(String plainText, byte[] secretKey) throws Exception {
    SecretKey key = new SecretKeySpec(secretKey, ALGORITHM);
    Cipher cipher = Cipher.getInstance(ALGORITHM);

    cipher.init(Cipher.ENCRYPT_MODE, key);

    byte[] encryptedBytes = cipher.doFinal(plainText.getBytes());
    String encryptedBase64Key = Base64.getEncoder().encodeToString(encryptedBytes);

    return encryptedBase64Key;
  }

  public String base64Decrypt(String plainText, byte[] secretKey) throws Exception {
    SecretKey key = new SecretKeySpec(secretKey, ALGORITHM);
    Cipher cipher = Cipher.getInstance(ALGORITHM);

    cipher.init(Cipher.DECRYPT_MODE, key);

    byte[] encryptedBytes = Base64.getDecoder().decode(plainText);
    byte[] decryptedBytes = cipher.doFinal(encryptedBytes);

    return new String(decryptedBytes);
  }
}
