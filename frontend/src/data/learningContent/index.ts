import { Lesson, TopicItem } from './types';
import { analogElectronicsTopics } from './analogElectronics';
import { digitalElectronicsTopics } from './digitalElectronics';
import { networkTheoryTopics } from './networkTheory';
import { signalsSystemsTopics } from './signalsSystems';
import { electronicDevicesTopics } from './electronicDevices';
import { controlSystemsTopics } from './controlSystems';
import { communicationSystemsTopics } from './communicationSystems';
import { emftTopics } from './emft';
import { electronicsLabTopics } from './electronicsLab';
import { mathematicsTopics } from './mathematics';

export * from './types';

export const expandedTopicItemsBySubject: Record<string, TopicItem[]> = {
  'Analog Electronics': analogElectronicsTopics,
  'Digital Electronics': digitalElectronicsTopics,
  'Network Theory': networkTheoryTopics,
  'Signals & Systems': signalsSystemsTopics,
  'Electronic Devices': electronicDevicesTopics,
  'Control Systems': controlSystemsTopics,
  'Communication Systems': communicationSystemsTopics,
  EMFT: emftTopics,
  'Electronics Lab': electronicsLabTopics,
  Mathematics: mathematicsTopics,
};

// Map of subject -> array of topic title strings (15 per subject)
export const expandedTopicsBySubject: Record<string, string[]> = Object.entries(
  expandedTopicItemsBySubject
).reduce((acc, [subject, items]) => {
  acc[subject] = items.map((item) => item.title);
  return acc;
}, {} as Record<string, string[]>);

// Map of topic title -> complete lesson content
export const expandedLessons: Record<string, Lesson> = Object.values(
  expandedTopicItemsBySubject
).reduce((acc, items) => {
  items.forEach((item) => {
    acc[item.title] = item.lesson;
  });
  return acc;
}, {} as Record<string, Lesson>);
