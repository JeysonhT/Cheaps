import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../../ui_colors.dart';

class ConceptMountInfo extends StatelessWidget {
  const ConceptMountInfo({
    super.key,
    required this.initTotal,
    required this.currentTotal,
  });

  final double initTotal;

  final double currentTotal;

  double getCurrentPercent(double total, double current) {
    return current * 100 / total;
  }

  @override
  Widget build(BuildContext context) {
    final currentPercent = getCurrentPercent(initTotal, currentTotal);

    return Card(
      color: Colors.white,
      clipBehavior: Clip.hardEdge,
      shadowColor: UiColors.babyPink,
      elevation: 5,
      child: Column(
        spacing: 10,
        mainAxisAlignment: MainAxisAlignment.center,
        mainAxisSize: MainAxisSize.max,
        children: [
          Text(
            'Total Actual',
            style: TextStyle(fontSize: 40, color: UiColors.babyPink),
          ),
          Text('C\$ ${currentTotal} ', style: TextStyle(fontSize: 60)),
          Padding(
            padding: EdgeInsetsGeometry.symmetric(vertical: 5, horizontal: 10),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Progreso actual: ${100.0 - currentPercent.ceil()}'),
                Text('Restante: ${currentPercent.ceil()} %'),
              ],
            ),
          ),
          Padding(
            padding: EdgeInsetsDirectional.symmetric(
              vertical: 10,
              horizontal: 10,
            ),
            child: LinearProgressIndicator(value: 1.0 - (currentPercent / 100)),
          ),
        ],
      ),
    );
  }
}
