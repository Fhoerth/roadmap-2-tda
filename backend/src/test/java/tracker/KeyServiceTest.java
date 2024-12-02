package tracker;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

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
import tracker.serialization.UserDeserializer;
import tracker.serialization.UserSerializer;
import tracker.services.EncryptionService;
import tracker.services.KeyService;
import tracker.utils.HexToBytes;

@ExtendWith(MockitoExtension.class)
public class KeyServiceTest {
  private static final String hexadecimalMasterKey = "fa3f34a0c776983ce9322e459c971e277b3568eb7627722fee6287c0b7c01472";

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
    when(keyRepository.findAll()).thenReturn(List.of(secretKey));

    assertDoesNotThrow(() -> keyService.getUnsignedSecretKey());
    verify(keyRepository, times(1)).findAll();
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

    String stringifiedUser = UserSerializer.serialize(user);

    String encryptedStringifiedUser = encryptionService.base64Encrypt(stringifiedUser, unsignedSecretKey);
    String unencryptedStringifiedUser = encryptionService.base64Decrypt(encryptedStringifiedUser, unsignedSecretKey);

    AtomicReference<User> deserializedUser = new AtomicReference<>();
    assertDoesNotThrow(() -> {
      deserializedUser.set(UserDeserializer.deserialize(unencryptedStringifiedUser));
    });

    assertEquals(deserializedUser.get(), user);
    assertEquals(deserializedUser.get().hashCode(), user.hashCode());
  }
}
