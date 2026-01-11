import 'package:cheaps/providers/services/concept_provider.dart';
import 'package:cheaps/ui/views/seller_page.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../ui_colors.dart';
import '../concept/concept_card.dart';

class SellerPageState extends State<SellerPage> {
  bool _isInit = true;

  int? _idSeller;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_isInit) {
      final args = ModalRoute.of(context)?.settings.arguments;
      final idSeller = args as int;

      setState(() {
        _idSeller = idSeller;
      });

      context.read<ConceptProvider>().getConcepts(idSeller);

      _isInit = false;
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ConceptProvider>();

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
        backgroundColor: UiColors.mauve,
      ),
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
            Navigator.pushNamed(context, 'addConcept', arguments: _idSeller!),
      ),
    );
  }
}
