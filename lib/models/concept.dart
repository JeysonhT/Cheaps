class Concept {
  final int? id;
  final String concept;
  final int idSeller;
  final DateTime createdAt;
  final double initTotal;
  final double currentTotal;

  const Concept({
    this.id,
    required this.concept,
    required this.idSeller,
    required this.createdAt,
    required this.initTotal,
    required this.currentTotal,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'concept': concept,
      'id_seller': idSeller,
      'created_at': createdAt.toIso8601String(),
      'init_total': initTotal,
      'current_total': currentTotal,
    };
  }

  factory Concept.fromMap(Map<String, dynamic> data) {
    return Concept(
      id: data['id'],
      concept: data['concept'],
      idSeller: data['id_seller'],
      createdAt: DateTime.parse(data['created_at']),
      initTotal: data['init_total'],
      currentTotal: data['current_total'],
    );
  }
}
