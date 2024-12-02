package tracker.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tracker.models.Key;
import tracker.providers.MasterKeyProvider;
import tracker.repositories.KeyRepository;

@Service
public class KeyService {
  private KeyRepository keyRepository;
  private EncryptionService encryptionService;
  private MasterKeyProvider masterKeyProvider;

  @Autowired
  public KeyService(KeyRepository keyRepository, EncryptionService encryptionService,
      MasterKeyProvider masterKeyProvider) {
    this.keyRepository = keyRepository;
    this.encryptionService = encryptionService;
    this.masterKeyProvider = masterKeyProvider;
  }

  public byte[] getUnsignedSecretKey() throws Exception {
    List<Key> keys = keyRepository.findAll();

    if (keys.isEmpty()) {
      throw new IllegalArgumentException("No keys found in the database.");
    }

    if (keys.size() > 1) {
      throw new IllegalStateException("More than one key was found in database.");
    }

    Key key = keys.get(0);
    String base64SecretKey = key.getBase64Key();
    byte[] masterKey = masterKeyProvider.getMasterKey();

    return encryptionService.decryptBase64SecretKey(base64SecretKey, masterKey);
  }

  public String generateAndStoreSignedSecretKey() throws Exception {
    byte[] masterKey = masterKeyProvider.getMasterKey();
    String base64SecretKey = encryptionService.createBase64SecretKey(masterKey);

    keyRepository.insert(new Key(base64SecretKey));

    return base64SecretKey;
  }
}
