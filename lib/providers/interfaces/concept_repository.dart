import 'package:cheaps/models/concept.dart';

abstract interface class ConceptRepository {
  void addConcept(Concept concept, int idSeller);

  Future<void> getConcepts(int idSeller);

  void deleteConcept(int idConcept, int idSeller);

  Future<void> updateConcept(
    int idConcept,
    double mount,
    double currentMount,
    int idSeller,
  );

  Future<void> getCurrentConcept(int idConcept);
}
