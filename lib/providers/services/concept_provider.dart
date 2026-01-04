import 'package:cheaps/db/database_helper.dart';
import 'package:cheaps/models/concept.dart';
import 'package:cheaps/providers/interfaces/concept_repository.dart';
import 'package:flutter/cupertino.dart';

class ConceptProvider extends ChangeNotifier implements ConceptRepository {
  List<Concept> _concepts = [];

  List<Concept> get concepts => _concepts;

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
  Future<void> updateConcept(Concept concept) {
    // TODO: implement updateConcept
    throw UnimplementedError();
  }

  @override
  void addConcept(Concept concept, int idSeller) async {
    final db = await DatabaseHelper.instance.database;

    await db.insert('concept', concept.toMap());
    await getConcepts(idSeller);
  }
}
