package tracker.mappers;

import java.util.List;
import java.util.stream.Collectors;
import tracker.DTO.LevelDTO;
import tracker.models.Level;

public class LevelMapper {
  public static LevelDTO toDTO(Level level) {
    return new LevelDTO(level.getId(), level.getName(), level.getLevel());
  }

  public static List<LevelDTO> toDTOList(List<Level> levels) {
    return levels.stream().map(LevelMapper::toDTO).collect(Collectors.toList());
  }
}
