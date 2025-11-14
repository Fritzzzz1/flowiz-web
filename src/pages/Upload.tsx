import { useState } from 'react';
import { Container } from '@components/layout/Container';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { PlatformSelector } from '@features/upload/components/PlatformSelector';
import { FileUpload } from '@features/upload/components/FileUpload';
import { YAMLEditor } from '@features/upload/components/YAMLEditor';
import { useParseConfig } from '@features/upload/hooks/useParseConfig';

export function Upload() {
  const [platform, setPlatform] = useState<'github' | 'gitlab'>('github');
  const [yamlContent, setYamlContent] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);

  const parseConfig = useParseConfig();

  const handleFileSelect = (content: string, name: string) => {
    setYamlContent(content);
    setFileName(name);
  };

  const handleParse = async () => {
    if (!yamlContent.trim()) return;

    parseConfig.mutate({
      platform,
      yamlContent,
    });
  };

  const handleClear = () => {
    setYamlContent('');
    setFileName(null);
  };

  const canParse = yamlContent.trim().length > 0 && !parseConfig.isPending;

  return (
    <div className="py-12">
      <Container maxWidth="2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Parse CI/CD Configuration
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload your GitHub Actions or GitLab CI configuration file to visualize your pipeline
          </p>
        </div>

        <div className="space-y-6">
          {/* Platform Selection */}
          <Card>
            <PlatformSelector value={platform} onChange={setPlatform} />
          </Card>

          {/* File Upload */}
          <Card
            header={
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upload File</h3>
                {fileName && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">File: {fileName}</span>
                )}
              </div>
            }
          >
            <FileUpload onFileSelect={handleFileSelect} />
          </Card>

          {/* YAML Editor */}
          <Card
            header={
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Or Paste YAML
                </h3>
              </div>
            }
          >
            <YAMLEditor value={yamlContent} onChange={setYamlContent} />
          </Card>

          {/* Actions */}
          <Card>
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={handleClear} disabled={!yamlContent}>
                Clear
              </Button>
              <div className="flex gap-3">
                <Button onClick={handleParse} disabled={!canParse} loading={parseConfig.isPending}>
                  {parseConfig.isPending ? 'Parsing...' : 'Parse & Visualize'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
