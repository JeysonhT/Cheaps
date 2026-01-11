import 'package:cheaps/ui/components/states/concept_form_state.dart';
import 'package:flutter/cupertino.dart';

class ConceptForm extends StatefulWidget {
  const ConceptForm({super.key, required this.idSeller});

  final int idSeller;

  @override
  State<ConceptForm> createState() => ConceptFormState();
}
