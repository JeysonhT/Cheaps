import 'package:cheaps/models/seller.dart';
import 'package:cheaps/providers/services/seller_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class MyHomePage extends StatelessWidget {
  const MyHomePage({super.key, required this.title});
  final String title;

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<SellerProvider>();
    return Scaffold(
      appBar: AppBar(
        title: Text(title),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: ListView.builder(
        itemCount: provider.sellers.length,
        itemBuilder: (context, index) {
          final seller = provider.sellers[index];
          return ListTile(
            title: Text(seller.name),
            trailing: IconButton(
              onPressed: () => provider.deleteSeller(seller.id!),
              icon: Icon(Icons.delete, color: Colors.red),
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => provider.saveSeller(Seller(name: "Jimmy")),
        tooltip: 'agregar vendedor',
        child: Icon(Icons.add, color: Colors.greenAccent),
      ),
    );
  }
}
