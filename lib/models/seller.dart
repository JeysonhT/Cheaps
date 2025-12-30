class Seller {
  final int? id;
  final String name;

  Seller({this.id, required this.name});

  Map<String, dynamic> toMap() {
    return {'id': id, 'name': name};
  }

  factory Seller.fromMap(Map<String, dynamic> data) {
    return Seller(id: data['id'], name: data['name']);
  }
}
