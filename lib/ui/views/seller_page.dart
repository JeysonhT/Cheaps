import 'package:cheaps/providers/services/concept_provider.dart';
import 'package:cheaps/ui/components/concept_card.dart';
import 'package:cheaps/ui/ui_colors.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class SellerPage extends StatelessWidget {
  const SellerPage({super.key, required this.title});

  final String title;

  @override
  Widget build(BuildContext context) {
    //argumentos de la ruta
    final args = ModalRoute.of(context)?.settings.arguments;
    final idSeller = args as int;
    final provider = context.watch<ConceptProvider>();

    //obtener los datos en base a la ruta
    provider.getConcepts(idSeller);
    return Scaffold(
      appBar: AppBar(title: Text(title), backgroundColor: UiColors.mauve),
      body: Padding(
        padding: EdgeInsetsGeometry.all(20),
        child: Center(
          child: (provider.concepts.isNotEmpty)
              ? ListView.builder(
                  itemCount: provider.concepts.length,
                  itemBuilder: (context, index) {
                    final c = provider.concepts[index];
                    return ConceptCard(concept: c);
                  },
                )
              : Text('Aun no hay datos de deudas'),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.add, color: Colors.black),
        onPressed: () =>
            Navigator.pushNamed(context, 'addConcept', arguments: idSeller),
      ),
    );
  }
}
