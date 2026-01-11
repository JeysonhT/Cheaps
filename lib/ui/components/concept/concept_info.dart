import 'package:cheaps/models/concept.dart';
import 'package:flutter/material.dart';

import '../../ui_colors.dart';

class ConceptInfo extends StatelessWidget {
  const ConceptInfo({super.key, required this.concept});

  final Concept concept;

  @override
  Widget build(BuildContext context) {
    const TextStyle subTitleStyle = TextStyle(
      fontSize: 20,
      fontFamily: 'Inter',
    );

    return Card(
      color: Colors.white,
      shadowColor: UiColors.babyPink,
      elevation: 2,
      child: Padding(
        padding: EdgeInsetsGeometry.symmetric(vertical: 10, horizontal: 10),
        child: Column(
          spacing: 10,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Row(
              mainAxisAlignment: .spaceBetween,
              children: [
                Text('Producto', style: subTitleStyle),
                Text(concept!.concept, style: subTitleStyle),
              ],
            ),
            Divider(),
            Row(
              mainAxisAlignment: .spaceBetween,
              children: [
                Text('Total Inicial: ', style: subTitleStyle),
                Text('${concept!.initTotal}', style: subTitleStyle),
              ],
            ),
            Divider(),
            Row(
              mainAxisAlignment: .spaceBetween,
              children: [
                Text('Fecha inicial: ', style: subTitleStyle),
                Text(
                  concept!.createdAt.toString().split(' ')[0],
                  style: subTitleStyle,
                ),
              ],
            ),
            Divider(),
            Row(
              mainAxisAlignment: .spaceBetween,
              children: [
                Text('Estado', style: subTitleStyle),
                Text(
                  (concept!.currentTotal > 0) ? 'Al Corriente' : 'Saldado',
                  style: (concept!.currentTotal > 0)
                      ? TextStyle(color: UiColors.babyPink, fontSize: 20)
                      : TextStyle(color: Colors.blue, fontSize: 20),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
