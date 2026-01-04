class Seller {
  final int? id;
  final String name;
  final String? phoneNumber;

  Seller({this.id, required this.name, this.phoneNumber});

  Map<String, dynamic> toMap() {
    return {'id': id, 'name': name, 'phone_number' : phoneNumber};
  }

  factory Seller.fromMap(Map<String, dynamic> data) {
    return Seller(id: data['id'], name: data['name'], phoneNumber: data['phone_number']);
  }
}
