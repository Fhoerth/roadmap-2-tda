package tracker.mappers;

import java.util.List;
import java.util.stream.Collectors;
import tracker.DTO.ProblemDTO;
import tracker.models.Problem;

public class ProblemMapper {
  public static ProblemDTO toDTO(Problem problem) {
    return new ProblemDTO(problem.getId(), problem.getLevelId(), problem.getLeetCodeProblemId(), problem.getName(),
        problem.getDifficulty(), problem.getUrl(), problem.getEditCodeUrl(), problem.getSlug());
  }

  public static List<ProblemDTO> toDTOList(List<Problem> problems) {
    return problems.stream().map(ProblemMapper::toDTO).collect(Collectors.toList());
  }
}
