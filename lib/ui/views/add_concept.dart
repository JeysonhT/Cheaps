import 'package:cheaps/ui/components/concept_form.dart';
import 'package:flutter/material.dart';

class AddConcept extends StatelessWidget {
  const AddConcept({super.key, required this.title});

  final String title;

  @override
  Widget build(BuildContext context) {
    final args = ModalRoute.of(context)?.settings.arguments;
    final idSeller = args as int;
    return Scaffold(
      appBar: AppBar(
        title: Text('Añadir concepto'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: Padding(
        padding: EdgeInsetsGeometry.all(10),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.start,
          children: [ConceptForm(idSeller: idSeller)],
        ),
      ),
    );
  }
}
