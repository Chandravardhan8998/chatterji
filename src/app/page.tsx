/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import { runQuery, StepsTypes } from '@/lib/api';
import Markdown from 'react-markdown';
import { motion } from 'framer-motion';
import { useState } from 'react';

import { CopyIcon } from 'lucide-react';
import { toast } from 'sonner';
import LoaderSteps from '@/components/loader-steps';

const steps: StepsTypes[] = [
  // 'enhance_prompt',
  'extract_topic',
  'extract_sub_topic',
  'split_text_doc',
  'embedd_topic',
  'run_user_query',
  // 'persona_inject',
  // 'END',
];

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string>();
  const [currentLoadingStep, setCurrentLoadingStep] = useState<StepsTypes>();
  const placeholders = [
    'How to integrate SQL in Django?',
    'What is Squash and Merge in Git?',
    'How can I use DevOps with Git?',
    'What do you have for me?',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setPrompt(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submitted');
    setCurrentLoadingStep(steps[0]);
    setResult('');
    runQuery(prompt, data => {
      setCurrentLoadingStep(data.next_step);
      if (data.next_step === 'END') {
        setResult(data.ui_response_text);
        console.log('END: ', data.ui_response_text);
      }
      console.log('Callback=> ', data);
    }).finally(() => {
      setCurrentLoadingStep(undefined);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="flex flex-col  w-full max-w-5xl mx-auto">
      {/* Header at Top */}
      <div className="flex flex-row justify-between items-center px-4">
        <div className="text-center py-4 text-2xl font-semibold ">
          Welcome to
          <span className="text-lime-500"> Chatter Ji</span>
        </div>
      </div>

      {/* Scrollable Middle Card */}
      <Card className="flex-1 overflow-y-auto border border-muted rounded-md">
        <CardContent className="p-4 h-[calc(100vh-35vh)]">
          {/* {!!result && <TextGenerateEffect words={result} />} */}
          <Markdown
            components={{
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              a: ({ node, ...props }) => (
                <a
                  {...props}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                />
              ),
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              h1: ({ node, ...props }) => (
                <h1 {...props} className="font-bold p-1 text-lime-200" />
              ),
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              h2: ({ node, ...props }) => (
                <h2 {...props} className="font-semibold p-1  text-lime-200" />
              ),
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              h3: ({ node, ...props }) => (
                <h3 {...props} className="font-semibold p-1  text-lime-200" />
              ),
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              p: ({ node, ...props }) => (
                <p
                  {...props}
                  className="font-display italic px-2  text-zinc-200"
                />
              ),
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              ul: ({ node, ...props }) => (
                <ul
                  {...props}
                  className="font-display ml-5  text-zinc-200 flex flex-col gap-1 border-l-2 border-zinc-500 pl-2"
                />
              ),

              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              pre: ({ node, ...props }) => (
                <pre
                  {...props}
                  className="text-cyan-600 font-semibold my-2 border-1 border-zinc-600 p-4 rounded-lg">
                  <div className="flex flex-row p-1 justify-end items-center">
                    <CopyIcon
                      className="text-zinc-400"
                      onClick={() => {
                        console.log(props.children);
                        navigator.clipboard
                          // @ts-expect-error
                          .writeText(props.children.props.children || 'N/A')
                          .then(
                            function () {
                              console.log(
                                'Async: Copying to clipboard was successful!',
                              );
                              toast('Copied Successfully.');
                            },
                            function (err) {
                              toast('Failed to copy this data.');
                              console.error(
                                'Async: Could not copy text: ',
                                err,
                              );
                            },
                          );
                      }}
                    />
                  </div>
                  {props.children}
                </pre>
              ),
            }}
            remarkPlugins={[]}>
            {result}
          </Markdown>
        </CardContent>
      </Card>
      <div id="loader" className="flex gap-1 ">
        {currentLoadingStep && (
          <LoaderSteps currentLoadingStep={currentLoadingStep} steps={steps} />
        )}
      </div>

      {/* Input at Bottom */}
      <div className="pt-4">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
        />
      </div>
    </motion.div>
  );
}
