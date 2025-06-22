import { StepsTypes } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

const stepVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export const stepMessages: Record<StepsTypes, string> = {
  extract_topic: 'Identifying the main topic from your request...',
  extract_sub_topic: 'Breaking down into relevant sub-topics...',
  split_text_doc: 'Splitting documentation for detailed analysis...',
  embedd_topic: 'Embedding topics into vector memory...',
  run_user_query: 'Running your query through enhanced context...',
  persona_inject: 'Hitesh sir is taking over in 3,2,1...',
  END: 'finished process.',
};
export default function LoaderSteps({
  steps,
  currentLoadingStep,
}: {
  steps: StepsTypes[];
  currentLoadingStep: StepsTypes;
}) {
  return (
    <div className="flex w-full flex-wrap gap-2 p-3 px-4 rounded-xl bg-neutral-900 shadow-xl justify-evenly mt-2 border border-muted">
      {steps.map(step => {
        const isActive = step === currentLoadingStep;
        return isActive ? (
          <AnimatePresence key={step}>
            <motion.div
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.3 }}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-all 
              ${
                isActive
                  ? 'bg-lime-800/20 border-lime-500 text-lime-400 shadow-lg '
                  : 'border-neutral-600 text-neutral-500 hover:border-neutral-400'
              }`}>
              {stepMessages[step]}
            </motion.div>
          </AnimatePresence>
        ) : null;
      })}
    </div>
  );
}
