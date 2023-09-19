# Threat Detection Regression Model

## [Try On Kaggle](https://www.kaggle.com/code/tanxena/threat-detection/notebook)

## Introduction

The primary objective of this project is to develop a regression-based machine learning model that predicts risk probability for threat detection in an IT log analyzer. By analyzing the provided parameters such as `SourceIP`, `DestinationIP`, `UserID`, `Device`, `EventType`, `EventDescription`, and `EventSeverity`, the model aims to give a numerical assessment of the potential risk associated with an event or activity.

## Parameters

The model utilizes the following parameters for predicting risk probability:

- _SourceIP_: The source IP address of the event.
- _DestinationIP_: The destination IP address related to the event.
- _UserID_: The ID of the user associated with the event.
- _Device_: The device involved in the event.
- _EventType_: The type of event that occurred.
- _EventDescription_: A description of the event.
- _EventSeverity_: The severity level of the event.

These parameters are essential in providing relevant information for the model to make accurate predictions regarding the risk associated with a potential threat.

## Model Architecture

The machine learning model employs a regression-based approach to predict the risk probability based on the provided parameters. The specific regression model architecture used can vary based on requirements and preferences.

## Working

The model requires string input for certain parameters and integers for others. By employing precise encoding techniques, the model effectively processes the given inputs and produces an output that aligns with the specified criteria. This proficiency is a direct result of the model being trained on a substantial real-world dataset with over 20,000 entries. Such rigorous training has significantly elevated the model's performance, resulting in remarkably high levels of accuracy.

## Conclusion

In summary, the Threat Detection Regression Model leverages regression-based machine learning to predict risk probability in IT log events. By analyzing key parameters, it provides valuable insights into potential threats. Trained on a substantial real-world dataset, this model achieves notable accuracy, enhancing threat detection capabilities and promoting a more secure digital landscape.
