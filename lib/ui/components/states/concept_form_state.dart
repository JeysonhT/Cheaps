import 'package:cheaps/models/concept.dart';
import 'package:cheaps/providers/services/concept_provider.dart';
import 'package:cheaps/ui/components/communication_components.dart';
import 'package:cheaps/ui/components/concept/concept_form.dart';
import 'package:cheaps/ui/ui_colors.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class ConceptFormState extends State<ConceptForm> {
  final _keyForm = GlobalKey<FormState>();
  DateTime? selectedDate;

  final conceptController = TextEditingController();
  final initTotalController = TextEditingController();

  Future<void> _selectDate() async {
    final DateTime? pickedDate = await showDatePicker(
      context: context,
      initialDate: DateTime(2026, 1, 1),
      firstDate: DateTime(2026),
      lastDate: DateTime(2027),
    );

    setState(() {
      selectedDate = pickedDate;
    });
  }

  @override
  Widget build(BuildContext context) {
    //provider para guardar los datos
    final provider = context.watch<ConceptProvider>();

    // retorno del widget de formulario
    return Form(
      key: _keyForm,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        spacing: 10,
        children: [
          TextFormField(
            controller: conceptController,
            maxLines: 1,
            keyboardType: TextInputType.text,
            textCapitalization: TextCapitalization.words,
            decoration: InputDecoration(
              label: Text('Ingrese el concepto de la deuda'),
              border: OutlineInputBorder(),
            ),
          ),
          TextFormField(
            controller: initTotalController,
            maxLines: 1,
            keyboardType: TextInputType.numberWithOptions(decimal: true),
            decoration: InputDecoration(
              label: Text('Ingresé el monto de la deuda'),
              border: OutlineInputBorder(),
            ),
          ),
          Padding(
            padding: EdgeInsetsGeometry.all(10),
            child: Text(
              (selectedDate != null)
                  ? '${selectedDate!.day}/${selectedDate!.month}/${selectedDate!.year}'
                  : 'No hay fecha seleccionada',
              style: TextStyle(fontSize: 20),
            ),
          ),
          OutlinedButton(
            onPressed: _selectDate,
            style: ElevatedButton.styleFrom(minimumSize: Size(250, 40)),
            child: Text('Seleccione una fecha', softWrap: true),
          ),
          ElevatedButton(
            onPressed:
                (conceptController.text.isNotEmpty &&
                    initTotalController.text.isNotEmpty &&
                    selectedDate != null)
                ? () {
                    provider.addConcept(
                      Concept(
                        concept: conceptController.text,
                        idSeller: widget.idSeller,
                        createdAt: selectedDate!,
                        initTotal: double.parse(initTotalController.text),
                        currentTotal: double.parse(initTotalController.text),
                      ),
                      widget.idSeller,
                    );
                    //limpieza de los campos de texto
                    conceptController.clear();
                    initTotalController.clear();
                    //mostrar el mensaje de exito
                    CommunicationComponents().showMessage(
                      context,
                      'El concepto de gasto fue guardado',
                      () => Navigator.pop(context),
                    );
                  }
                : () => CommunicationComponents().showMessage(
                    context,
                    'Todos los campos del formulario deben ser llenados',
                    () => {},
                  ),
            style: ElevatedButton.styleFrom(
              backgroundColor: UiColors.mauve,
              minimumSize: Size(250, 40),
            ),
            child: Text('Guardar Datos'),
          ),
        ],
      ),
    );
  }
}
