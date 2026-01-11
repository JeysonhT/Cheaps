import 'package:cheaps/providers/services/concept_provider.dart';
import 'package:cheaps/ui/components/concept/concept_info.dart';
import 'package:cheaps/ui/components/concept/concept_mount_info.dart';
import 'package:cheaps/ui/views/concept_page.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../models/concept.dart';
import '../pay/pay_dialog.dart';
import '../pay/pay_list.dart';

class ConceptPageState extends State<ConceptPage> {
  Concept? _concept;

  bool _isInit = true;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();

    if (_isInit) {
      final args = ModalRoute.of(context)?.settings.arguments;
      final idConcept = args as int;

      _isInit = false;

      context.read<ConceptProvider>().getCurrentConcept(idConcept);
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ConceptProvider>();

    _concept = provider.currentConcept;

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsetsGeometry.all(10),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            spacing: 10,
            children: [
              //info de la deuda
              ConceptMountInfo(
                initTotal: _concept!.initTotal,
                currentTotal: _concept!.currentTotal,
              ),
              //Titulo de la siguiente sección
              ListTile(
                leading: Icon(Icons.info),
                title: Text(
                  'Detalles del producto',
                  style: TextStyle(fontSize: 20),
                ),
              ),
              //info del producto
              ConceptInfo(concept: _concept!),
              PayDialog(
                idConcept: _concept!.id!,
                mount: _concept!.currentTotal,
                idSeller: _concept!.idSeller,
              ),
              //Titulo de la siguiente sección
              ListTile(
                leading: Icon(Icons.timer_outlined),
                title: Text(
                  'Actividad reciente',
                  style: TextStyle(fontSize: 20),
                ),
              ),
              PayList(idConcept: _concept!.id!),
            ],
          ),
        ),
      ),
    );
  }
}
