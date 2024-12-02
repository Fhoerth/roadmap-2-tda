package tracker;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import tracker.models.Key;
import tracker.models.User;
import tracker.providers.MasterKeyProvider;
import tracker.repositories.KeyRepository;
import tracker.services.EncryptionService;
import tracker.services.KeyService;
import tracker.utils.HexToBytes;

@ExtendWith(MockitoExtension.class)
public class KeyServiceTest {
  private static final String hexadecimalMasterKey = "fa3f34a0c776983ce9322e459c971e277b3568eb7627722fee6287c0b7c01472";
  private static final ObjectMapper objectMapper = new ObjectMapper();

  private EncryptionService encryptionService;

  @Mock
  private MasterKeyProvider masterKeyProvider;

  @Mock
  private KeyRepository keyRepository;

  @InjectMocks
  private KeyService keyService;

  @BeforeEach
  public void setup() {
    MockitoAnnotations.openMocks(this);
    encryptionService = new EncryptionService();
    keyService = new KeyService(keyRepository, encryptionService, masterKeyProvider);
  }

  @Test
  public void test_generate_and_store_signed_secret_key() {
    AtomicReference<String> base64SecretKey = new AtomicReference<>();

    when(masterKeyProvider.getMasterKey()).thenReturn(HexToBytes.convert(hexadecimalMasterKey));

    assertDoesNotThrow(() -> {
      base64SecretKey.set(keyService.generateAndStoreSignedSecretKey());
    });

    Key secretKey = new Key(base64SecretKey.get());

    ArgumentCaptor<Key> captor = ArgumentCaptor.forClass(Key.class);
    verify(keyRepository, times(1)).insert(captor.capture()); // Verifica que se llamó a insert

    Key capturedKey = captor.getValue();

    assertNotNull(capturedKey, "The captured key should not be null");
    assertNotNull(capturedKey.getBase64Key(), "The key field should not be null");
    assertEquals(secretKey.getBase64Key(), capturedKey.getBase64Key(),
        "The base64 key should match the key field in the captured object");
    // when(keyRepository.findAll()).thenReturn(List.of(secretKey));

    // assertDoesNotThrow(() -> keyService.getUnsignedSecretKey());
    // verify(keyRepository, times(1)).findAll();
  }

  @Test
  public void test_get_unsigned_secret_key() throws Exception {
    when(masterKeyProvider.getMasterKey()).thenReturn(HexToBytes.convert(hexadecimalMasterKey));

    String base64SecretKey = keyService.generateAndStoreSignedSecretKey();
    Key secretKey = new Key(base64SecretKey);

    when(keyRepository.findAll()).thenReturn(List.of(secretKey));

    byte[] unsignedSecretKey = keyService.getUnsignedSecretKey();

    User user = new User("752/23", "JohnDoe", 1234);
    user.setId(new ObjectId("64a98712c0a73b4bf8f91b75"));

    String stringifiedUser = objectMapper.writeValueAsString(user);
    String encryptedStringifiedUser = encryptionService.base64Encrypt(stringifiedUser, unsignedSecretKey);
    String unencryptedStringifiedUser = encryptionService.base64Decrypt(encryptedStringifiedUser, unsignedSecretKey);
    System.out.println(unencryptedStringifiedUser);
    // String originalString =
    // String encryptedString

    // // Step 1. Mock save.
    // when(keyRepository.save(any(Key.class))).thenAnswer(invocation ->
    // invocation.getArgument(0));

    // // Step 2. Mock findAll.
    // when(keyRepository.findAll()).thenReturn(List.of(mockKey));

    // byte[] secretKey = keyService.getSecretKey();
    // // Mock the master key provider to return the static key
    // when(masterKeyProvider.getMasterKey()).thenReturn(STATIC_MASTER_KEY);

    // // Mock the EncryptionService to simulate key creation
    // String mockEncryptedKey =
    // Base64.getEncoder().encodeToString("mocked-encrypted-key".getBytes());
    // when(encryptionService.createSecretKey(STATIC_MASTER_KEY)).thenReturn(mockEncryptedKey);

    // // Test the method
    // String result = keyService.generateAndStoreKey();

    // // Verify the repository interaction
    // verify(keyRepository, times(1)).save(any(Key.class));

    // // Assert the result matches the mock
    // assertEquals(mockEncryptedKey, result);
  }

  @Test
  public void testGetDecryptedKey() throws Exception {
    // // Mock the master key provider
    // when(masterKeyProvider.getMasterKey()).thenReturn(STATIC_MASTER_KEY);

    // // Mock the key repository to return a single stored key
    // String mockEncryptedKey =
    // Base64.getEncoder().encodeToString("mocked-encrypted-key".getBytes());
    // Key mockKey = new Key(mockEncryptedKey);
    // when(keyRepository.findAll()).thenReturn(List.of(mockKey));

    // // Mock the decryption process
    // SecretKey expectedKey = new SecretKeySpec(new byte[32], ALGORITHM);
    // when(encryptionService.decryptSecretKey(mockEncryptedKey,
    // STATIC_MASTER_KEY)).thenReturn(expectedKey);

    // // Test the method
    // SecretKey result = keyService.getDecryptedKey();

    // // Assert the key matches the expected value
    // assertEquals(expectedKey, result);
  }
}
