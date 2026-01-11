import 'package:cheaps/ui/components/states/concept_page_state.dart';
import 'package:flutter/material.dart';

class ConceptPage extends StatefulWidget {
  const ConceptPage({super.key, required this.title});

  final String title;

  @override
  State<ConceptPage> createState() => ConceptPageState();
}
