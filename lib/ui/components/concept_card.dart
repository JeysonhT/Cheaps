import 'package:cheaps/models/concept.dart';
import 'package:cheaps/ui/ui_colors.dart';
import 'package:flutter/material.dart';

class ConceptCard extends StatelessWidget {
  const ConceptCard({super.key, required this.concept});

  final Concept concept;

  @override
  Widget build(BuildContext context) {
    return Card(
      color: UiColors.icyBlue,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          ListTile(
            title: Text(concept.concept, style: TextStyle(fontSize: 25)),
            subtitle: Text(
              '${concept.currentTotal}',
              style: TextStyle(fontSize: 15),
            ),
            trailing: Text(
              concept.createdAt.toString().split(' ')[0],
              style: TextStyle(fontSize: 15),
            ),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              Padding(
                padding: EdgeInsetsGeometry.symmetric(
                  vertical: 5,
                  horizontal: 10,
                ),
                child: Icon(Icons.delete, color: UiColors.babyPink, size: 30),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
