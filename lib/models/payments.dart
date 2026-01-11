class Payments {
  const Payments({
    this.id,
    required this.idConcept,
    required this.pay,
    required this.payAt,
  });

  final int? id;
  final int idConcept;
  final double pay;
  final DateTime payAt;

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'id_concept': idConcept,
      'pay': pay,
      'pay_at': payAt.toIso8601String(),
    };
  }

  factory Payments.fromMap(Map<String, dynamic> data) {
    return Payments(
      id: data['id'],
      idConcept: data['id_concept'],
      pay: data['pay'],
      payAt: DateTime.parse(data['pay_at']),
    );
  }
}
