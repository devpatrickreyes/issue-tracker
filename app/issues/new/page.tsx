'use client'
import { TextField, Button, Callout, Text } from '@radix-ui/themes'
import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { createIssueSchema } from '@/app/validationSchemas';
import { z } from 'zod';
import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';

type IssueForm = z.infer<typeof createIssueSchema>;

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false });

const NewIssuePage = () => {
  const router = useRouter();
  const { register, control, handleSubmit, formState: { errors }} = useForm <IssueForm> ({
    resolver: zodResolver(createIssueSchema)
  });
  const [ error, setError] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const onSubmit = handleSubmit(async(data) => {
    try {
      setSubmitting(true);
      await axios.post('/api/issues', data);
      router.push('/issues');
      
    } catch (error) {
      setSubmitting(false);
      setError('An unexpected error occured');
    } 
  } )
  return (
    <div className ='max-w-xl'>
      {error && (
      <Callout.Root color="red">
      <Callout.Text>{error}</Callout.Text>
      </Callout.Root>
      )}
      <form className = 'space-y-3' 
      onSubmit={onSubmit}
      > 
      <TextField.Root placeholder="Title" {...register('title')}>   
      </TextField.Root>
      
      <ErrorMessage>{errors.title?.message}</ErrorMessage>
      

      <Controller
        name ='description'
        control ={control}
        render={( { field }) => <SimpleMDE placeholder='Description' {...field} />}
        />
      <ErrorMessage>{errors.description?.message}</ErrorMessage>
      <Button disabled={isSubmitting}>Submit New Issue {isSubmitting && <Spinner />}</Button>
      </form>
    </div>
  )
}

export default NewIssuePage