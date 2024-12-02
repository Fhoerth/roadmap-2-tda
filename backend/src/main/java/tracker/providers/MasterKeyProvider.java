package tracker.providers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import tracker.utils.HexToBytes;

@Component
public class MasterKeyProvider {
  @Value("${app.hexadecimal-master-key}")
  private String hexadecimalMasterKey;

  public byte[] getMasterKey() {
    return HexToBytes.convert(hexadecimalMasterKey);
  }
}
