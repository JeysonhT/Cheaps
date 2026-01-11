import 'package:cheaps/db/database_helper.dart';
import 'package:cheaps/models/concept.dart';
import 'package:cheaps/providers/interfaces/concept_repository.dart';
import 'package:flutter/cupertino.dart';

class ConceptProvider extends ChangeNotifier implements ConceptRepository {
  List<Concept> _concepts = [];

  List<Concept> get concepts => _concepts;

  Concept? _concept;

  Concept get currentConcept => _concept!;

  @override
  void deleteConcept(int idConcept, int idSeller) async {
    final db = await DatabaseHelper.instance.database;
    await db.delete('concept', where: 'id = ?', whereArgs: [idConcept]);
    await getConcepts(idSeller);
  }

  @override
  Future<void> getConcepts(int idSeller) async {
    final db = await DatabaseHelper.instance.database;
    final listSeller = await db.query(
      'concept',
      where: 'id_seller = ?',
      whereArgs: [idSeller],
    );

    _concepts = listSeller.map((data) => Concept.fromMap(data)).toList();
    notifyListeners();
  }

  @override
  Future<void> updateConcept(
    int idConcept,
    double mount,
    double currentMount,
    int idSeller,
  ) async {
    final db = await DatabaseHelper.instance.database;

    await db.update(
      'concept',
      {'current_total': currentMount - mount},
      where: 'id = ?',
      whereArgs: [idConcept],
    );

    await getCurrentConcept(idConcept);
    await getConcepts(idSeller);
  }

  @override
  void addConcept(Concept concept, int idSeller) async {
    final db = await DatabaseHelper.instance.database;

    await db.insert('concept', concept.toMap());
    await getConcepts(idSeller);
  }

  @override
  Future<void> getCurrentConcept(int idConcept) async {
    final db = await DatabaseHelper.instance.database;

    List result = await db.query(
      'concept',
      where: 'id = ?',
      whereArgs: [idConcept],
    );

    _concept = result.map((data) => Concept.fromMap(data)).first;

    notifyListeners();
  }
}
